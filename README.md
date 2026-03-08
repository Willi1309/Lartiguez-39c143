# Full Stack Implementation Exercise

This project is a full stack implementation developed to demonstrate skills in software architecture, relational database management, and cloud deployment.

## 🛠️ Technologies and Runtime Environment

### Runtimes and Engines

* **Node.js**: v24.11.0
* **Package Manager**: npm v11.6.1
* **Database**: PostgreSQL (Deployed at Neon.tech)
* **Version Control**: Git v2.51.2

### Frontend

* **Framework**: React v19.2.0
* **Language**: TypeScript
* **Deployment**: Render (Static Site)
* **Port used in localhost**: 5173

### Backend

* **Framework**: NestJS v11.0.1
* **Language**: TypeScript
* **Architecture**: Layered (Controllers, Modules, Services, and Repositories).
* **Deployment**: Render (Web Service)
* **Port used in localhost**: 3000

## Deployment Links

* **Frontend**: [Client](https://lartiguez-39c143-1.onrender.com/)
* **Backend**: [API](https://lartiguez-39c143.onrender.com/)

## Credentials

**Username**: user
**Password**: password

## Project Structure

The backend has been structured following **NestJS** best practices, dividing the business logic into layers to ensure scalability and code maintainability:
1. **Controllers**: Management of routes and HTTP requests.
2. **Modules**: Logical organization of the different parts of the application.
3. **Services**: Centralized business logic.
4. **Repositories**: Abstraction of the data layer.