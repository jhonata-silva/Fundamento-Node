// /users/:id
export function buildRoutePath(path) {
    const routeParametersRegex = /:([a-zA-Z]+)/g
    const pathWithParams = path.replaceAll(routeParametersRegex, '(?<$1>[a-z0-9\\-_]+)') // Escape correto para regex

    const pathRegex = new RegExp(`^${pathWithParams}`) // Uso de template literals

    return pathRegex
}
