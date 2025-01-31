using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using TestTask.Data.Entities;
using TestTask.Data.Utils;

public class CsvController : Controller
{
    private readonly string _csvFilePath = "wwwroot/data/products.csv";

    [Authorize]
    public IActionResult Index()
    {
        var products = CsvParser.ParseCsv<Product>(_csvFilePath);
        return View(products);
    }
}
