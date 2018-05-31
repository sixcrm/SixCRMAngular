
export function featureFlagsQuery(environment: string): string {
  return `{
    featureflag (environment: "${environment}") {
			configuration
		}}`
}


