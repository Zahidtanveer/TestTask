using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Reflection;

namespace TestTask.Data.Utils
{
    public static class CsvParser
    {
        public static List<T> ParseCsv<T>(string filePath) where T : new()
        {
            var result = new List<T>();

            try
            {
                if (!File.Exists(filePath))
                    throw new FileNotFoundException($"CSV file not found: {filePath}");

                var lines = File.ReadAllLines(filePath);
                if (lines.Length < 2)
                    throw new Exception("CSV file must have a header and at least one data row.");

                var headers = lines[0].Split(',').Select(h => h.Trim()).ToArray();
                var properties = typeof(T).GetProperties(BindingFlags.Public | BindingFlags.Instance);

                for (int i = 1; i < lines.Length; i++)
                {
                    var values = lines[i].Split(',').Select(v => v.Trim()).ToArray();
                    if (values.Length != headers.Length)
                        throw new Exception($"Data row {i + 1} does not match header count.");

                    var obj = new T();
                    for (int j = 0; j < headers.Length; j++)
                    {
                        var property = properties.FirstOrDefault(p => p.Name.Equals(headers[j], StringComparison.OrdinalIgnoreCase));
                        if (property == null) continue;

                        try
                        {
                            object convertedValue = Convert.ChangeType(values[j], property.PropertyType, CultureInfo.InvariantCulture);
                            property.SetValue(obj, convertedValue);
                        }
                        catch (Exception)
                        {
                            throw new Exception($"Error converting value '{values[j]}' to type {property.PropertyType.Name} in row {i + 1}, column {headers[j]}.");
                        }
                    }

                    result.Add(obj);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error parsing CSV: {ex.Message}");
            }

            return result;
        }
    }

}
