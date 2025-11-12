using Microsoft.AspNetCore.Mvc;

[Route("api/[controller]")]
[ApiController]
public class ImagesController : ControllerBase
{
    private readonly IWebHostEnvironment _env;

    public ImagesController(IWebHostEnvironment env)
    {
        _env = env;
    }

    [HttpGet("{filename}")]
    public IActionResult GetImage(string filename)
    {
        // Path tới folder chứa ảnh, ví dụ: wwwroot/images
        var path = Path.Combine(_env.WebRootPath, "room_images", filename);

        if (!System.IO.File.Exists(path))
            return NotFound();

        var mime = "image/" + Path.GetExtension(filename).TrimStart('.'); 
        var fileBytes = System.IO.File.ReadAllBytes(path);
        return File(fileBytes, mime);
    }
}
