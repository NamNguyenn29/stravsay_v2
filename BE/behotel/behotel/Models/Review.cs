using System;
using System.Collections.Generic;

namespace behotel.Models
{
    public class Review
    {
        public Guid ReviewID { get; set; }               
        public Guid BookingID { get; set; }             
        public Guid UserID { get; set; }                

        public int Rating { get; set; }                  

        public string? Title { get; set; }               
        public string? Content { get; set; }             
        public string? ModerationReason { get; set; }    
        public string? ModerationNote { get; set; }      

        public bool IsDeleted { get; set; }             
        public DateTime? DeletedDate { get; set; }       
        public Guid? DeletedBy { get; set; }             

        public DateTime? UpdatedDate { get; set; }       
        public Guid? UpdatedBy { get; set; }       

        public int Status { get; set; }                 

        public DateTime CreatedDate { get; set; }     

        public ICollection<ReviewAttachment> ReviewAttachments { get; set; }
    }
}
