using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using Dapper;
using Microsoft.Extensions.Configuration;
using TestTask.Data.Entities;

namespace TestTask.Data.Respository
{
    public class ProductRepository
    {
        private readonly string _connectionString;

        public ProductRepository(string connectionString)
        {
            _connectionString = connectionString;
        }

        public async Task<IEnumerable<Product>> GetAllProductsAsync()
        {
            using var connection = new SqlConnection(_connectionString);
            return await connection.QueryAsync<Product>("sp_GetAllProducts", commandType: CommandType.StoredProcedure);
        }

        public async Task<int> InsertProductAsync(Product product)
        {
            using var connection = new SqlConnection(_connectionString);
            var parameters = new DynamicParameters();
            parameters.Add("@Name", product.Name);
            parameters.Add("@Price", product.Price);
            parameters.Add("@Quantity", product.Quantity);

            return await connection.ExecuteScalarAsync<int>("sp_InsertProduct", parameters, commandType: CommandType.StoredProcedure);
        }

        public async Task<bool> UpdateProductAsync(Product product)
        {
            using var connection = new SqlConnection(_connectionString);
            var parameters = new DynamicParameters();
            parameters.Add("@Id", product.Id);
            parameters.Add("@Name", product.Name);
            parameters.Add("@Price", product.Price);
            parameters.Add("@Quantity", product.Quantity);

            return await connection.ExecuteAsync("sp_UpdateProduct", parameters, commandType: CommandType.StoredProcedure) > 0;
        }

        public async Task<bool> DeleteProductAsync(int id)
        {
            using var connection = new SqlConnection(_connectionString);
            var parameters = new DynamicParameters();
            parameters.Add("@Id", id);

            return await connection.ExecuteAsync("sp_DeleteProduct", parameters, commandType: CommandType.StoredProcedure) > 0;
        }
    }
   

}
