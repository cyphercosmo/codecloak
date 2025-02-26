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
  return items
    .filter(item => item.inStock)
    .reduce((total, item) => total + item.price * item.quantity, 0);
}`
  },
  {
    name: "Python Example",
    code: `def fibonacci(n):
    """Generate Fibonacci sequence up to n"""
    a, b = 0, 1
    result = []
    while a < n:
        result.append(a)
        a, b = b, a + b
    return result

print(fibonacci(100))`
  }
];
