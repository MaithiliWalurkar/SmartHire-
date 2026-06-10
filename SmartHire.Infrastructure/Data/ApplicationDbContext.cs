using Microsoft.EntityFrameworkCore;
using SmartHire.Core.Entities;
using System;
using System.Collections.Generic;
using System.Text;

namespace SmartHire.Infrastructure.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Job> Jobs { get; set; }
        public DbSet<JobApplication> JobApplications { get; set; }
        public DbSet<CandidateProfile> CandidateProfiles { get; set; }
        public DbSet<WorkExperience> WorkExperiences { get; set; }
        public DbSet<Education> Educations { get; set; }
        public DbSet<Skill> Skills { get; set; }
        public DbSet<Project> Projects { get; set; }
        public DbSet<Interview> Interviews { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // User Configuration
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(100);
                entity.HasIndex(e => e.Email).IsUnique();
                entity.Property(e => e.FullName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.PhoneNumber).HasMaxLength(15);
            });

            // Job Configuration
            modelBuilder.Entity<Job>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(200);
                entity.Property(e => e.Description).IsRequired();
                entity.Property(e => e.Location).HasMaxLength(100);
                entity.Property(e => e.JobType).HasMaxLength(50);
                entity.Property(e => e.SalaryMin).HasColumnType("decimal(18,2)");
                entity.Property(e => e.SalaryMax).HasColumnType("decimal(18,2)");
            });

            // JobApplication Configuration
            modelBuilder.Entity<JobApplication>(entity =>
            {
                entity.HasKey(e => e.Id);

                entity.HasOne(e => e.Job)
                    .WithMany(j => j.Applications)
                    .HasForeignKey(e => e.JobId)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(e => e.Candidate)
                    .WithMany(u => u.Applications)
                    .HasForeignKey(e => e.CandidateId)
                    .OnDelete(DeleteBehavior.Restrict);

                entity.Property(e => e.ResumeFileName).HasMaxLength(255);
                entity.Property(e => e.ResumeFilePath).HasMaxLength(500);
            });

            // CandidateProfile Configuration
            modelBuilder.Entity<CandidateProfile>(entity =>
            {
                entity.HasKey(e => e.Id);
                
                entity.HasOne(e => e.User)
                    .WithOne()
                    .HasForeignKey<CandidateProfile>(e => e.UserId)
                    .OnDelete(DeleteBehavior.Cascade);
                
                entity.Property(e => e.ExpectedSalary).HasColumnType("decimal(18,2)");
            });

            // WorkExperience Configuration
            modelBuilder.Entity<WorkExperience>(entity =>
            {
                entity.HasKey(e => e.Id);
                
                entity.HasOne(e => e.CandidateProfile)
                    .WithMany(p => p.WorkExperiences)
                    .HasForeignKey(e => e.CandidateProfileId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Education Configuration
            modelBuilder.Entity<Education>(entity =>
            {
                entity.HasKey(e => e.Id);
                
                entity.HasOne(e => e.CandidateProfile)
                    .WithMany(p => p.Educations)
                    .HasForeignKey(e => e.CandidateProfileId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Skill Configuration
            modelBuilder.Entity<Skill>(entity =>
            {
                entity.HasKey(e => e.Id);
                
                entity.HasOne(e => e.CandidateProfile)
                    .WithMany(p => p.Skills)
                    .HasForeignKey(e => e.CandidateProfileId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Project Configuration
            modelBuilder.Entity<Project>(entity =>
            {
                entity.HasKey(e => e.Id);
                
                entity.HasOne(e => e.CandidateProfile)
                    .WithMany(p => p.Projects)
                    .HasForeignKey(e => e.CandidateProfileId)
                    .OnDelete(DeleteBehavior.Cascade);
                
                entity.Property(e => e.ProjectName).IsRequired().HasMaxLength(200);
            });

            // Interview Configuration
            modelBuilder.Entity<Interview>(entity =>
            {
                entity.HasKey(e => e.Id);
                
                entity.HasOne(e => e.Application)
                    .WithMany()
                    .HasForeignKey(e => e.ApplicationId)
                    .OnDelete(DeleteBehavior.Cascade);
                
                entity.Property(e => e.ScheduledDate).IsRequired();
                entity.Property(e => e.Type).IsRequired();
                entity.Property(e => e.Status).IsRequired();
            });
        }
    }
}
