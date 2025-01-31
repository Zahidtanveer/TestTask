using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using TestTask.Data.Entities;
using TestTask.Data.Respository;

namespace TestTask.Web.Controllers
{
    [Authorize]
    public class ProductsController : Controller
    {
        private readonly ProductRepository _productRepository;

        public ProductsController(ProductRepository productRepository)
        {
            _productRepository = productRepository;
        }

        // GET: /Products
        public async Task<IActionResult> Index()
        {
            var products = await _productRepository.GetAllProductsAsync();
            return View(products);
        }

        // GET: /Products/Create
        public IActionResult Create()
        {
            return View();
        }

        // POST: /Products/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Product product)
        {
            if (!ModelState.IsValid)
            {
                return View(product);
            }

            await _productRepository.InsertProductAsync(product);
            return RedirectToAction(nameof(Index));
        }

        // GET: /Products/Edit/5
        public async Task<IActionResult> Edit(int id)
        {
            var products = await _productRepository.GetAllProductsAsync();
            var product = products.FirstOrDefault(p => p.Id == id);

            if (product == null)
            {
                return NotFound();
            }

            return View(product);
        }

        // POST: /Products/Edit
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(Product product)
        {
            if (!ModelState.IsValid)
            {
                return View(product);
            }

            await _productRepository.UpdateProductAsync(product);
            return RedirectToAction(nameof(Index));
        }

        // GET: /Products/Delete/5
        public async Task<IActionResult> Delete(int id)
        {
            var products = await _productRepository.GetAllProductsAsync();
            var product = products.FirstOrDefault(p => p.Id == id);

            if (product == null)
            {
                return NotFound();
            }

            return View(product);
        }

        // POST: /Products/DeleteConfirmed/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            await _productRepository.DeleteProductAsync(id);
            return RedirectToAction(nameof(Index));
        }
    }

}
