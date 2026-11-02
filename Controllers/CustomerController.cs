using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CameraMemories.Controllers
{
    public class CustomerController : Controller
    {
        // GET: Customer
        public ActionResult Register()
        {
            return View();
        }

        public ActionResult SignIn()
        {
            return View();
        }
    }
}