using System;
using System.Net.Http;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Text;

namespace ApiConsumerApp
{
    class Program
    {
        private static readonly string apiBaseUrl = "https://prog-3175-assign3.vercel.app";

        static async Task Main(string[] args)
        {
            await GetTimesOfDay();
            await GetSupportedLanguages();
            await GetGreetingMessage();
        }

        private static async Task GetTimesOfDay()
        {
            using (HttpClient client = new HttpClient())
            {
                try
                {
                    HttpResponseMessage response = await client.GetAsync($"{apiBaseUrl}/api/GetAllTimesOfDay");
                    response.EnsureSuccessStatusCode();
                    string responseBody = await response.Content.ReadAsStringAsync();
                    var apiResponse = JsonConvert.DeserializeObject<ApiResponse<TimeOfDay>>(responseBody);

                    if (apiResponse?.Data != null && apiResponse.Data.Count > 0)
                    {
                        Console.WriteLine("Possible Times Of Day:");
                        foreach (var time in apiResponse.Data)
                        {
                            Console.WriteLine(time.TimeOfDayValue);
                        }
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error: {ex.Message}");
                }
            }
        }

        private static async Task GetSupportedLanguages()
        {
            using (HttpClient client = new HttpClient())
            {
                try
                {
                    HttpResponseMessage response = await client.GetAsync($"{apiBaseUrl}/api/GetSupportedLanguages");
                    response.EnsureSuccessStatusCode();
                    string responseBody = await response.Content.ReadAsStringAsync();
                    var apiResponse = JsonConvert.DeserializeObject<ApiResponse<Language>>(responseBody);

                    if (apiResponse?.Data != null && apiResponse.Data.Count > 0)
                    {
                        Console.WriteLine("Supported Languages:");
                        foreach (var language in apiResponse.Data)
                        {
                            Console.WriteLine(language.LanguageName);
                        }
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error: {ex.Message}");
                }
            }
        }

        private static async Task GetGreetingMessage()
        {
            Console.WriteLine("Please select a time of day (Morning, Afternoon, Evening):");
            string timeOfDay = Console.ReadLine();

            Console.WriteLine("Please select a language (English, French, Spanish):");
            string language = Console.ReadLine();

            Console.WriteLine("Please select a tone (Formal, Casual):");
            string tone = Console.ReadLine();

            if (string.IsNullOrEmpty(timeOfDay) || string.IsNullOrEmpty(language) || string.IsNullOrEmpty(tone))
            {
                Console.WriteLine("All fields are required. Please try again.");
                return;
            }

            var requestBody = new
            {
                timeOfDay = timeOfDay.Trim(),
                language = language.Trim(),
                tone = tone.Trim()
            };

            string jsonBody = System.Text.Json.JsonSerializer.Serialize(requestBody);

            var content = new StringContent(jsonBody, Encoding.UTF8, "application/json");

            using (HttpClient client = new HttpClient())
            {
                client.DefaultRequestHeaders.Add("Accept", "application/json");

                try
                {
                    HttpResponseMessage response = await client.PostAsync($"{apiBaseUrl}/Greet", content);

                    if (response.IsSuccessStatusCode)
                    {
                        string responseBody = await response.Content.ReadAsStringAsync();
                        var result = JsonConvert.DeserializeObject<GreetingResponse>(responseBody);

                        if (result != null && !string.IsNullOrEmpty(result.GreetingMessage))
                        {
                            Console.WriteLine(result.GreetingMessage);
                        }
                        else
                        {
                            Console.WriteLine("No greeting message found in the response.");
                        }
                    }
                    else
                    {
                        string errorResponse = await response.Content.ReadAsStringAsync();
                        Console.WriteLine(errorResponse);
                    }
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Exception: {ex.Message}");
                }
            }
        }
    }

    public class ApiResponse<T>
    {
        public string Message { get; set; }
        public List<T> Data { get; set; }
    }

    public class TimeOfDay
    {
        [JsonProperty("timeOfDay")]
        public string TimeOfDayValue { get; set; }
    }

    public class Language
    {
        [JsonProperty("language")]
        public string LanguageName { get; set; }
    }

    public class GreetingResponse
    {
        [JsonProperty("greetingMessage")]
        public string GreetingMessage { get; set; }
    }
}
