import { EnkaClient } from 'enka-network-api'

// Синглтон: один клиент на весь процесс сервера.
// enka-network-api скачивает игровые данные (имена, иконки, стихии) в кэш —
// делаем это лениво и ровно один раз.
let client: EnkaClient | null = null
let readyPromise: Promise<EnkaClient> | null = null

export function getEnka(): EnkaClient {
  if (!client) {
    client = new EnkaClient({
      defaultLanguage: 'ru',
      cacheDirectory: '.enka-cache',
    })
  }
  return client
}

// Гарантирует, что игровые данные скачаны и закэшированы.
// Повторные вызовы переиспользуют один и тот же промис.
export function ensureEnkaReady(): Promise<EnkaClient> {
  if (!readyPromise) {
    const enka = getEnka()
    readyPromise = (async () => {
      await enka.cachedAssetsManager.cacheDirectorySetup()
      if (!enka.cachedAssetsManager.hasAllContents()) {
        // Первый запуск: качаем игровые данные (может занять время)
        await enka.cachedAssetsManager.fetchAllContents()
      }
      return enka
    })()
  }
  return readyPromise
}
