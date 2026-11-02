using CameraMemories.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace CameraMemories.Controllers
{
    public class HomeController : Controller
    {
        // GET: Home
        ProductDBContext data = new ProductDBContext();

        private List<>
        public ActionResult Index()
        {
            return View();
        }
         
        //GET: Produce
        public ActionResult Produce()
        {
            return View();
        }
    }
}