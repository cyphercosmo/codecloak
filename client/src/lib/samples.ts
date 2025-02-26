export function loadSample(): string {
  return `/**
 * A simple React component example
 */
function WelcomeCard({ name, role }) {
  const [expanded, setExpanded] = React.useState(false);
  
  return (
    <div className="card">
      <h2>Welcome, {name}!</h2>
      {expanded && (
        <div className="details">
          <p>Role: {role}</p>
          <p>Access: Full</p>
        </div>
      )}
      <button onClick={() => setExpanded(!expanded)}>
        {expanded ? 'Show Less' : 'Show More'}
      </button>
    </div>
  );
}`;
}

export const additionalSamples = [
  {
    name: "JavaScript Function",
    code: `function calculateTotal(items) {
  // Calculate the total price of all in-stock items
  return items
    .filter(item => item.inStock)
    .reduce((total, item) => total + item.price * item.quantity, 0);
}`
  },
  {
    name: "Python Script",
    code: `def fibonacci(n):
    """Generate Fibonacci sequence up to n"""
    a, b = 0, 1
    result = []
    while a < n:
        result.append(a)
        a, b = b, a + b
    return result

# Calculate and print the Fibonacci sequence
print(fibonacci(100))`
  },
  {
    name: "HTML Page",
    code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sample Page</title>
  <style>
    body { font-family: Arial, sans-serif; }
    .container { max-width: 800px; margin: 0 auto; }
    header { background-color: #f4f4f4; padding: 1rem; }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <!-- Site header -->
      <h1>Welcome to our site</h1>
    </header>
    <main>
      <p>This is a sample HTML page.</p>
    </main>
  </div>
</body>
</html>`
  },
  {
    name: "CSS Stylesheet",
    code: `.card {
  /* Card styling */
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 16px;
  margin-bottom: 16px;
  background-color: white;
}

.card-header {
  /* Header styling */
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 8px;
}

.card-body {
  /* Content area */
  color: #333;
  line-height: 1.5;
}

/* Media query for responsive design */
@media (max-width: 768px) {
  .card {
    padding: 12px;
  }
}`
  },
  {
    name: "TypeScript Interface",
    code: `/**
 * User model interface
 */
interface User {
  id: number;
  username: string;
  email: string;
  createdAt: Date;
  role: UserRole;
  profile?: UserProfile;
}

/**
 * User role enum
 */
enum UserRole {
  ADMIN = 'admin',
  EDITOR = 'editor',
  VIEWER = 'viewer'
}

/**
 * User profile interface
 */
interface UserProfile {
  firstName: string;
  lastName: string;
  avatar?: string;
  bio?: string;
}

// Create user function
function createUser(data: Omit<User, 'id' | 'createdAt'>): User {
  // Implementation would go here
  return {
    id: Math.floor(Math.random() * 10000),
    createdAt: new Date(),
    ...data
  };
}`
  }
];
