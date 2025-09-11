// System color configurations
export const getSystemColors = (slug) => {
  switch(slug) {
    case 'commodore-64':
      return { 
        primary: '#8B7355',
        secondary: '#6B5B47',
        light: 'rgba(139, 115, 85, 0.1)',
        gradient: 'linear-gradient(135deg, #8B7355 0%, #6B5B47 100%)',
        className: 'system-c64'
      };
    case 'zx-spectrum':
      return { 
        primary: '#0000FF',
        secondary: '#FF00FF',
        light: 'rgba(0, 0, 255, 0.1)',
        gradient: 'linear-gradient(135deg, #0000FF 0%, #FF00FF 100%)',
        className: 'system-spectrum'
      };
    case 'nintendo-entertainment-system':
      return { 
        primary: '#922B3E',
        secondary: '#373737',
        light: 'rgba(146, 43, 62, 0.1)',
        gradient: 'linear-gradient(135deg, #922B3E 0%, #373737 100%)',
        className: 'system-nes'
      };
    case 'commodore-amiga':
      return { 
        primary: '#0055AA',
        secondary: '#FF8800',
        light: 'rgba(0, 85, 170, 0.1)',
        gradient: 'linear-gradient(135deg, #0055AA 0%, #FF8800 100%)',
        className: 'system-amiga'
      };
    default:
      return { 
        primary: '#64748b',
        secondary: '#475569',
        light: 'rgba(100, 116, 139, 0.1)',
        gradient: 'linear-gradient(135deg, #64748b 0%, #475569 100%)',
        className: 'system-default'
      };
  }
};

// Get difficulty icon
export const getDifficultyIcon = (level) => {
  switch(level?.toLowerCase()) {
    case 'easy':
    case 'beginner': return '🟢';
    case 'intermediate': return '🟡';
    case 'hard':
    case 'advanced': return '🔴';
    default: return '⚪';
  }
};