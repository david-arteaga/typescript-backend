import { interfaces, injectable, inject, Container } from "inversify";

const container = new Container()

export function Injectable (): ClassDecorator {
  return function(target: any) {
    const value = injectable()(target)
    const symbol = assignAndGetSymbolForType(target)
    container.bind(symbol).to(target).inSingletonScope()
    return value
  }
}

export function Inject(type: Function): ParameterDecorator {
  return (target, targetKey, index) => inject(getTypeSymbol(type))(target, targetKey as any, index)
}

export const getInstanceDI = <Type> (target: Class<Type>) => container.get<Type>(getTypeSymbol(target))

export const registerContantValueForSymbol = <Type> (symbol: symbol, value: Type) => container.bind(symbol).toConstantValue(value)
export const getInstanceForSymbol = <Type> (typeSymbol: symbol) => container.get<Type>(typeSymbol)

const decorated_class_type_key = '@@Inject/___decorated_class_type_function_key'
const assignAndGetSymbolForType = (target: any) => {
  // Check if there has been a value getter already defined
  const previousGetter = target[decorated_class_type_key] as (() => symbol) | undefined
  if (previousGetter !== undefined) {
    console.warn(`Type ${target.name} already has a type symbol getter registered. It will be replaced.`)
    return previousGetter()
  }
  
  // No previous symbol has been assigned, create a new symbol assign a new type symbol getter
  const symbol = Symbol(target.name)
  Object.assign(target, {
    [decorated_class_type_key]: () => symbol,
  })
  return symbol
}

const getTypeSymbol = (target: Function) => {
  const symbolGetter = (target as any)[decorated_class_type_key]
  if (!symbolGetter) {
    throw new Error(`Type ${target.name} does not have a type symbol getter.\nIt most likely has not been annotated with @Inject()`)
  }
  return symbolGetter()
}
interface Class<T> {
  new (...args: any[]): T;
}

// export const registerConstantValueForType = <Type> (target: Class<Type>, value: Type) => {
//   const symbol = assignAndGetSymbolForType(target)
//   container.bind(symbol).toConstantValue(value)
// }
