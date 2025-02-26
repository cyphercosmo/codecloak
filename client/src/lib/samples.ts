export function loadSample(): string {
  return `/**
 * A simple React component example
 * @author CodeCloak Team
 */
// Configuration for the component
// TODO: Add more customization options
function WelcomeCard({ name, role }) {
  // Initialize state for expanded view
  const [expanded, setExpanded] = React.useState(false);
  
  /* 
   * This component renders a card with user information
   * that can be expanded or collapsed
   */
  return (
    <div className="card">
      <h2>Welcome, {name}!</h2>
      {expanded && (
        <div className="details">
          <p>Role: {role}</p>
          <p>Access: Full</p>
          {/* Additional user details could be shown here */}
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
    code: `/**
 * Calculates the total price of in-stock items
 * @param {Array} items - Array of items with price and quantity
 * @return {Number} The calculated total price
 */
function calculateTotal(items) {
  // Filter out items that are not in stock
  return items
    .filter(item => item.inStock)
    // Calculate the total using reduce
    .reduce((total, item) => {
      // Multiply price by quantity for each item
      return total + item.price * item.quantity;
    }, 0); // Start with 0
}`
  },
  {
    name: "Python Example",
    code: `def fibonacci(n):
    """
    Generate Fibonacci sequence up to n
    
    Args:
        n: Upper limit for sequence values
        
    Returns:
        List of Fibonacci numbers less than n
    """
    a, b = 0, 1  # Initialize first two values
    result = []  # Store results in a list
    
    # Generate sequence until we reach n
    while a < n:
        result.append(a)
        # Calculate next value in sequence
        a, b = b, a + b
        
    return result

# Example usage of the function
print(fibonacci(100))`
  }
];
