// Test script to verify security validation
const testMaliciousURL = (url) => {
  // Simulate the security validation we implemented
  const search = url.includes('?') ? url.split('?')[1] : '';
  
  // Check for SQL injection patterns
  const sqlPatterns = [
    '~and~', 'union select', 'drop table', 'delete from', 
    'insert into', 'update.*set', '--', ';', '/*', '*/'
  ];
  
  // Check for XSS patterns
  const xssPatterns = [
    '<script', 'javascript\\:', 'onload', 'onerror', 
    'onclick', 'onmouseover', 'eval\\(', 'document\\.cookie'
  ];
  
  // Combine all patterns
  const maliciousPatterns = [...sqlPatterns, ...xssPatterns];
  
  // Check if any malicious pattern is present
  const hasMaliciousPattern = maliciousPatterns.some(pattern => 
    new RegExp(pattern, 'i').test(search)
  );
  
  // Check for excessively long query strings
  const hasLongQuery = search.length > 200;
  
  // Check for excessive repetition of characters
  const hasRepetition = /(.)\1{10,}/.test(search);
  
  console.log('Testing URL:', url);
  console.log('Search params:', search);
  console.log('Search length:', search.length);
  console.log('Has malicious pattern:', hasMaliciousPattern);
  console.log('Has long query:', hasLongQuery);
  console.log('Has repetition:', hasRepetition);
  
  return hasMaliciousPattern || hasLongQuery || hasRepetition;
};

// Test the problematic URL
const maliciousURL = '/register/?/&/~and~/~and~/~and~/~and~/~and~/~and~/~and~/~and~/~and~/~and~/~and~/~and~/~and~/~and~/~and~/~and~/~and~/~and~/~and~/~and~/~and~/~and~/~and~/~and~/~and~/~and~/~and~/~and~/~and~/~and~/~and~/~and~/~and~/~and~/~and~/~and~/~and~/~and~/~and~/~and~/~and~/~and~/~and~/~and~/~and~/~and~/~and~/~and~/~and~/~and~/~and~/~and~/~and~/~and~/~and~/~and~/~and~/~and~/~and~/~and~/~and~/~and~/~and~/~and~/~and~/~and~/~and~/~and~/~and~/';

console.log('Should block:', testMaliciousURL(maliciousURL));

// Test a clean URL
const cleanURL = '/register/';
console.log('Should allow:', testMaliciousURL(cleanURL));// Trigger deployment
