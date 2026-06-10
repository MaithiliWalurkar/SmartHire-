using System;
using System.Collections.Generic;
using System.Text;

namespace SmartHire.Core.DTOs
{
    public class CreateApplicationDto
    {
        public int JobId { get; set; }
        public string CoverLetter { get; set; } = string.Empty;
        // We'll handle file upload in the API controller directly
    }
}
