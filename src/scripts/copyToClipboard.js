// Copy code block content to clipboard
window.copyToClipboard = function(button) {
  // Get the code content from the parent div, excluding the button
  const codeBlock = button.parentElement;
  const codeLines = Array.from(codeBlock.children)
    .filter(child => child !== button && child.tagName === 'DIV')
    .map(div => {
      // Extract text content, handling special cases
      let text = div.textContent || div.innerText || '';
      // Replace non-breaking spaces with regular spaces
      text = text.replace(/\u00A0/g, ' ');
      // Handle empty lines (they contain &nbsp;)
      if (text.trim() === '') {
        return '';
      }
      return text;
    })
    .join('\n');
  
  // Copy to clipboard
  navigator.clipboard.writeText(codeLines).then(() => {
    // Show feedback
    const originalText = button.textContent;
    button.textContent = '✅ Copied!';
    button.style.background = 'rgba(34, 197, 94, 0.2)';
    
    // Reset after 2 seconds
    setTimeout(() => {
      button.textContent = originalText;
      button.style.background = 'rgba(255,255,255,0.1)';
    }, 2000);
  }).catch(err => {
    console.error('Failed to copy: ', err);
    button.textContent = '❌ Failed';
    setTimeout(() => {
      button.textContent = '📋 Copy';
    }, 2000);
  });
};