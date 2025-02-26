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
  },
  {
    name: "C++ Example",
    code: `#include <iostream>
#include <vector>

/**
 * Sorts an array of integers using quicksort algorithm
 * @param arr The array to sort
 * @param left Starting index
 * @param right Ending index 
 */
void quickSort(std::vector<int>& arr, int left, int right) {
    int i = left, j = right;
    int pivot = arr[(left + right) / 2];

    /* Partition the array */
    while (i <= j) {
        // Find element on left that should be on right
        while (arr[i] < pivot)
            i++;
        
        // Find element on right that should be on left
        while (arr[j] > pivot)
            j--;
        
        // Swap elements and move indices
        if (i <= j) {
            std::swap(arr[i], arr[j]);
            i++;
            j--;
        }
    }
    
    // Recursive calls
    if (left < j)
        quickSort(arr, left, j);
    if (i < right)
        quickSort(arr, i, right);
}`
  },
  {
    name: "SQL Query",
    code: `-- Query to find top customers by order value
-- Created: 2023-03-15
-- Author: Database Team

SELECT 
    c.customer_id,
    c.first_name,
    c.last_name,
    /* Calculate the total amount spent */
    SUM(o.total_amount) AS total_spent
FROM 
    customers c
    /* Join with orders table */
    INNER JOIN orders o ON c.customer_id = o.customer_id
WHERE 
    -- Only include orders from last year
    o.order_date BETWEEN '2022-01-01' AND '2022-12-31'
    -- Only include completed orders
    AND o.status = 'completed'
GROUP BY 
    c.customer_id,
    c.first_name,
    c.last_name
-- Sort by highest spenders first
ORDER BY 
    total_spent DESC
LIMIT 10; -- Show only top 10`
  }
];
