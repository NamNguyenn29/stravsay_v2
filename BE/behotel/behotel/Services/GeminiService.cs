using System.Text;
using System.Text.Json;

namespace behotel.Services
{
    public class GeminiService
    {
        private readonly HttpClient _httpClient;
        private readonly IConfiguration _configuration;
        public GeminiService(HttpClient httpClient, IConfiguration configuration)
        {
            _httpClient = httpClient;
            _configuration = configuration;
        }
        public async Task<String> getChatResponse(string prompt)
        {
            var requestBody = new
            {
                contents = new[]
                {
                    new
                    {
                        parts = new []
                        {
                            new
                            {
                                text = prompt
                            }
                        }
                    }
                }



            };
            var request = new HttpRequestMessage(
                          HttpMethod.Post,
                          "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent");
            request.Headers.Add("x-goog-api-key", _configuration["Gemini:ApiKey"]);
            request.Content = new StringContent(JsonSerializer.Serialize(requestBody),
                Encoding.UTF8,
                "application/json");
            var response = await _httpClient.SendAsync(request);
            if (response.IsSuccessStatusCode)
            {
                var responseContent = await response.Content.ReadAsStreamAsync();
                using var jsonDoc = await JsonDocument.ParseAsync(responseContent);

                var text = jsonDoc.RootElement.GetProperty("candidates")[0]
                                                .GetProperty("content")
                                               .GetProperty("parts")[0]
                                               .GetProperty("text")
                                               .GetString();
                return text ?? "No response from Gemini";
            }
            else
            {
                throw new HttpRequestException($"Error : {response.StatusCode},{await response.Content.ReadAsStringAsync()}");
            }



        }

    }
}
