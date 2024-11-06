using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using AutoRepairManagerApp.Core.DTO;
using System.Security.Cryptography;
using AutoRepairManagerApp.Core.Services;
using System.Text;
using AutoRepairManagerApp.Core.Models;
using AutoRepairManagerApp.Infrastructure.Services;
using System.Net.Mail;
using System.Net;

namespace AutoRepairManagerApp.Infrastructure.Controllers;
public class IdentityController : Controller
{
    private readonly IIdentityService identityService;
    private readonly IAutoRepairService autoRepairService;
    private readonly IEmailService emailService;
    private string verificationCode;

    private readonly IConfiguration avatarDirConfiguration;

    private readonly IDataProtector dataProtector;
    public IdentityController(IIdentityService identityService, IDataProtectionProvider dataProtectionProvider, IConfiguration avatarDirConfiguration, IAutoRepairService bookService, IEmailService emailService)
    {
        this.identityService = identityService;
        this.dataProtector = dataProtectionProvider.CreateProtector("identity");
        this.avatarDirConfiguration = avatarDirConfiguration;
        this.autoRepairService = bookService;
        this.emailService = emailService;
    }

    [Route("/[controller]/[action]", Name = "LoginView")]
    [AllowAnonymous]
    public IActionResult Login(string? ReturnUrl)
    {
        var errorMessage = base.TempData["error"];
        ViewBag.ReturnUrl = ReturnUrl;
        if (errorMessage != null)
        {
            base.ModelState.AddModelError("All", errorMessage.ToString()!);
        }

        return base.View();
    }

    [HttpPost]
    [AllowAnonymous]
    [Route("/api/[controller]/[action]", Name = "LoginEndpoint")]
    public async Task<IActionResult> Login([FromForm] LogInDTO loginDto)
    {
        loginDto.Password = Convert.ToBase64String(Encoding.UTF8.GetBytes(loginDto.Password));
        var foundUser = await this.identityService.Login(loginDto);
        if (foundUser == null)
        {
            base.TempData["error"] = "Incorrect login or password!";
            return base.RedirectToRoute("LoginView", new
            {
                loginDto.ReturnUrl
            });
        }
        var hashedUserId = this.dataProtector.Protect(foundUser.Id.ToString());

        var claims = new Claim[] {
                new(ClaimTypes.Email, foundUser.Email),
                new(ClaimTypes.Name, foundUser.Name),
                new("Id", hashedUserId),
                //new(ClaimTypes.Role, await this.identityService.GetRole(foundUser.Id)),
            };

        var claimsIdentity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);

        var claimsPrincipal = new ClaimsPrincipal(claimsIdentity);

        await base.HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, claimsPrincipal);

        if (string.IsNullOrWhiteSpace(loginDto.ReturnUrl) == false)
        {
            return base.Redirect(loginDto.ReturnUrl);
        }

        base.HttpContext.Response.Cookies.Append("CurrentUserId", foundUser.Id.ToString());
        return base.RedirectToAction(controllerName: "Book", actionName: "Index");
    }

    [HttpGet]
    [Authorize()]
    [Route("/api/[controller]/[action]", Name = "LogoutEndpoint")]
    public async Task<IActionResult> Logout(string? ReturnUrl)
    {

        base.HttpContext.Response.Cookies.Delete("CurrentUserId");
        await base.HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        return base.RedirectToRoute("LoginView", new
        {
            ReturnUrl
        });

    }

    [Route("/[controller]/[action]", Name = "RegistrationView")]
    [AllowAnonymous]
    public IActionResult Registration()
    {
        if (TempData["error"] != null)
        {
            ModelState.AddModelError("All", TempData["error"].ToString());
            System.Console.WriteLine(TempData["error"]);
        }

        return base.View();
    }

    [HttpPost]
    [AllowAnonymous]
    [Route("/api/[controller]/[action]", Name = "RegistrationEndpoint")]
    public async Task<IActionResult> Registration([FromForm] RegistrationDTO registrationDto, IFormFile avatar)
    {
        try
        {
            registrationDto.Password = Convert.ToBase64String(Encoding.UTF8.GetBytes(registrationDto.Password));
            var userId = await this.identityService.Registration(registrationDto);
            if (userId == null) throw new Exception("This email is already being used by another user");

            var avatarFilePath = $"{avatarDirConfiguration["StaticFileRoutes:Avatars"]}{userId}";

            if (avatar == null)
            {
                var defaultAvatarUrl = "https://wallpapers.com/images/hd/blank-default-pfp-wue0zko1dfxs9z2c.jpg";

                var uri = new Uri(defaultAvatarUrl);
                var extension = Path.GetExtension(uri.AbsolutePath);

                using var httpClient = new HttpClient();
                HttpResponseMessage response = null;

                try
                {
                    response = await httpClient.GetAsync(defaultAvatarUrl);
                    response.EnsureSuccessStatusCode();
                }
                catch (HttpRequestException e)
                {
                    throw new Exception("Error fetching default avatar from the internet: " + e.Message);
                }

                using var newFileStream = System.IO.File.Create(avatarFilePath + extension);
                await response.Content.CopyToAsync(newFileStream);
            }
            else
            {
                var extension = Path.GetExtension(avatar.FileName);

                using var newFileStream = System.IO.File.Create(avatarFilePath + extension);
                await avatar.CopyToAsync(newFileStream);
            }
        }
        catch (Exception ex)
        {
            TempData["error"] = ex.Message;
            return base.RedirectToRoute("RegistrationView");
        }

        return base.RedirectToRoute("LoginView");
    }


    [HttpGet]
    [AllowAnonymous]
    [Route("[controller]/[action]/{id}")]
    [ActionName("GetById")]
    public async Task<ActionResult> GetById(Guid id)
    {
        var user = await identityService.GetByIdAsync(id);
        Guid senderId;
        var hashedSenderId = base.HttpContext.Request.Cookies["CurrentUserId"];

        if (string.IsNullOrWhiteSpace(hashedSenderId) == false)
        {

            Guid.TryParse(hashedSenderId, out senderId);
            if (senderId == id)
            {
                ViewBag.IsCurrentAccount = true;
                //ViewBag.HasPendingRequest = await identityService.(id);
            }
            else ViewBag.IsCurrentAccount = false;
        }
        else
        {
            ViewBag.IsCurrentAccount = false;
        }
        ViewBag.avatarDirPath = avatarDirConfiguration["StaticFileRoutes:Avatars"];
        ViewBag.avatarPath = ViewBag.avatarDirPath + user.Id;
        ViewBag.UserId = user.Id;


        return base.View(user);
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> SendEmail(string userEmail, string subject)
    {
        try
        {
            verificationCode = emailService.GenerateVerificationCode();
            string message = $"Your verification code: {verificationCode}";
            await emailService.SendEmailAsync(userEmail, subject, message);
            Console.WriteLine("Email sent successfully.");

            // Store the verification code in TempData
            TempData["VerificationCode"] = verificationCode;
        }
        catch (Exception ex)
        {
            Console.WriteLine("General error sending email: " + ex.Message);
        }
        return RedirectToRoute("VerifyEmailView");
    }

    [Authorize]
    [Route("[controller]/[action]/", Name = "VerifyEmailView")]
    public IActionResult VerifyEmail()
    {
        if (TempData["error"] != null)
        {
            ModelState.AddModelError("All", TempData["error"].ToString());
            System.Console.WriteLine(TempData["error"]);
        }

        // Pass the verification code to the view
        ViewBag.VerificationCode = TempData["VerificationCode"];

        return View();
    }

    [HttpPost]
    [Authorize]
    [Route("api/[controller]/[action]/", Name = "VerifyEmailEndpoint")]
    public async Task<IActionResult> VerifyEmail(string enteredCode, string hiddenCode)
    {
        if (string.IsNullOrEmpty(enteredCode) || enteredCode != hiddenCode)
        {
            TempData["error"] = "The entered code is incorrect.";
            return RedirectToRoute("VerifyEmailView");
        }

        System.Console.WriteLine(enteredCode);
        System.Console.WriteLine(hiddenCode);
        await this.emailService.VerifyEmail(new Guid(base.HttpContext.Request.Cookies["CurrentUserId"]));
        return RedirectToAction("Index", "Book");
    }

}
