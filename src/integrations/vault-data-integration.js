// Astro Integration for Vault Data Generation
// This runs at build time to generate the centralized vault data

export default function vaultDataIntegration() {
  return {
    name: 'vault-data-generator',
    hooks: {
      'astro:build:start': async ({ logger }) => {
        logger.info('Generating vault data from content collections...');

        // We can't use the generate function directly here because
        // Astro collections aren't available in the integration context
        // Instead, we'll create a simple aggregator

        // For now, we'll log that this should be done
        logger.info('Note: Vault data should be regenerated when content changes');
        logger.info('Run: npm run generate-vault-data');
      },

      'astro:config:setup': ({ updateConfig, config, logger }) => {
        // Add the vault data to the build
        logger.info('Vault data integration loaded');

        // We could add virtual modules here if needed
        updateConfig({
          vite: {
            plugins: [{
              name: 'vault-data-provider',
              resolveId(id) {
                if (id === 'virtual:vault-data') {
                  return '\0virtual:vault-data';
                }
              },
              load(id) {
                if (id === '\0virtual:vault-data') {
                  // Return the vault data module
                  return `
                    import { vaultData, vaultCategories } from '/src/data/vault-data.js';
                    export { vaultData, vaultCategories };
                  `;
                }
              }
            }]
          }
        });
      }
    }
  };
}