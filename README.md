# SmartHire - AI-Powered Job & Candidate Management System

A full-stack recruitment management system built with ASP.NET Core Web API and React TypeScript.

## 🚀 Features

### Authentication & Authorization
- ✅ JWT-based authentication
- ✅ Role-based access control (Admin & Candidate)
- ✅ Secure password hashing with BCrypt
- ✅ Form validation with strong password requirements

### Admin Features
- ✅ Dashboard with real-time statistics
- ✅ Job posting management (Create, Read, Update, Delete)
- ✅ Application tracking and status management
- ✅ Candidate management
- ✅ Analytics and reporting

### Candidate Features
- ✅ Browse active job listings
- ✅ Apply for jobs with resume upload
- ✅ Track application status
- ✅ View application history

### Form Validations (Registration)
- ✅ Required field validation (Name, Email, Password)
- ✅ Email format validation
- ✅ Phone number validation (10 digits)
- ✅ Strong password requirements:
  - Minimum 8 characters
  - At least one uppercase letter
  - At least one lowercase letter
  - At least one number
  - At least one special character (!@#$%^&*)
- ✅ Duplicate email/phone detection
- ✅ Form reset after successful registration

## 🛠️ Tech Stack

### Backend
- **Framework**: ASP.NET Core 8.0 Web API
- **Database**: SQL Server with Entity Framework Core
- **Authentication**: JWT Bearer Tokens
- **Architecture**: Clean Architecture with Repository Pattern
- **ORM**: Entity Framework Core (Code First)

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS 3
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Icons**: Lucide React

## 📁 Project Structure

```
SmartHire/
├── SmartHire.API/              # Web API Project
│   ├── Controllers/            # API Controllers
│   ├── Program.cs             # Application entry point
│   └── appsettings.json       # Configuration
├── SmartHire.Core/            # Domain Layer
│   ├── Entities/              # Domain models
│   ├── DTOs/                  # Data Transfer Objects
│   ├── Enums/                 # Enumerations
│   └── Interfaces/            # Repository interfaces
├── SmartHire.Infrastructure/  # Data Access Layer
│   ├── Data/                  # DbContext
│   ├── Repositories/          # Repository implementations
│   └── Services/              # Business services
└── smarthire-frontend/        # React Frontend
    ├── src/
    │   ├── components/        # Reusable components
    │   ├── pages/            # Page components
    │   ├── context/          # React Context (Auth)
    │   └── services/         # API services
    └── public/
```

## 🚦 Getting Started

### Prerequisites
- .NET 8.0 SDK
- Node.js 18+ and npm
- SQL Server (LocalDB or Express)

### Backend Setup

1. **Navigate to API project**:
   ```powershell
   cd SmartHire/SmartHire.API
   ```

2. **Update database connection** (if needed) in `appsettings.json`:
   ```json
   "ConnectionStrings": {
     "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=SmartHireDB;Trusted_Connection=true"
   }
   ```

3. **Run database migrations**:
   ```powershell
   dotnet ef database update --project ../SmartHire.Infrastructure --startup-project .
   ```

4. **Run the API**:
   ```powershell
   dotnet run
   ```
   API will be available at: `http://localhost:5276`

### Frontend Setup

1. **Navigate to frontend**:
   ```powershell
   cd smarthire-frontend
   ```

2. **Install dependencies**:
   ```powershell
   npm install --legacy-peer-deps
   ```

3. **Run development server**:
   ```powershell
   npm run dev
   ```
   Frontend will be available at: `http://localhost:5173`

## 📝 API Endpoints

### Authentication
- `POST /api/Auth/register` - Register new user
- `POST /api/Auth/login` - User login

### Jobs
- `GET /api/Jobs` - Get all jobs
- `GET /api/Jobs/active` - Get active jobs
- `GET /api/Jobs/{id}` - Get job by ID
- `POST /api/Jobs` - Create job (Admin only)
- `PUT /api/Jobs/{id}` - Update job (Admin only)
- `DELETE /api/Jobs/{id}` - Delete job (Admin only)

### Applications
- `GET /api/Applications` - Get all applications
- `GET /api/Applications/job/{jobId}` - Get applications by job
- `GET /api/Applications/candidate/{candidateId}` - Get applications by candidate
- `POST /api/Applications` - Submit application (Candidate only)
- `PUT /api/Applications/{id}/status` - Update application status (Admin only)

### Dashboard
- `GET /api/Dashboard/stats` - Get dashboard statistics (Admin only)

## 🔐 Default Test Accounts

### Admin Account
- Email: `admin@smarthire.com`
- Password: `Admin@123`
- Role: Admin

### Candidate Account
- Email: `candidate@smarthire.com`
- Password: `Candidate@123`
- Role: Candidate

## 🎨 Features Showcase

### Registration with Validation
- Real-time field validation
- Password strength indicator
- Duplicate detection
- Clear error messages
- Form reset after success

### Admin Dashboard
- Total jobs count
- Active jobs count
- Total applications
- Pending applications
- Shortlisted candidates
- Quick action buttons

### Job Listings
- Card-based layout
- Filter by status
- Application count
- Salary range display
- Location and job type

## 🔧 Configuration

### JWT Settings (appsettings.json)
```json
"JwtSettings": {
  "SecretKey": "YourSuperSecretKeyForJWTTokenGeneration12345",
  "Issuer": "SmartHireAPI",
  "Audience": "SmartHireClient",
  "ExpiryInMinutes": 60
}
```

### CORS Configuration
CORS is enabled for all origins in development mode. Update `Program.cs` for production.

## 📊 Database Schema

### Users Table
- Id, FullName, Email, PasswordHash, PhoneNumber, Role, CreatedAt, IsActive

### Jobs Table
- Id, Title, Description, Requirements, Location, JobType, SalaryMin, SalaryMax, PostedDate, ClosingDate, IsActive, PostedBy

### JobApplications Table
- Id, JobId, CandidateId, CoverLetter, ResumeFileName, ResumeFilePath, Status, AppliedDate, AdminNotes

## 🚀 Deployment

### Backend Deployment
1. Publish the API:
   ```powershell
   dotnet publish -c Release
   ```
2. Deploy to Azure App Service, IIS, or Docker

### Frontend Deployment
1. Build for production:
   ```powershell
   npm run build
   ```
2. Deploy `dist` folder to Netlify, Vercel, or Azure Static Web Apps

## 📈 Future Enhancements

- [ ] Email notifications for applications
- [ ] Interview scheduling
- [ ] Video interview integration
- [ ] Resume parsing with AI
- [ ] Advanced search and filters
- [ ] Candidate skill matching
- [ ] Export reports (PDF/Excel)
- [ ] Multi-language support

## 🤝 Contributing

This is a portfolio project. Feel free to fork and customize for your needs.

## 📄 License

This project is open source and available for educational purposes.

## 👤 Author

**Maithili Walurkar**
- .NET Developer with 1.3+ years of experience
- Specialized in ASP.NET Core, React, and SQL Server

---

## 📞 Support

For issues or questions, please create an issue in the repository.

**Built with ❤️ using ASP.NET Core and React**
