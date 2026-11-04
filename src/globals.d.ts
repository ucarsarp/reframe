// Browser globals used by the site scripts in src/lib
interface Window {
  __reframeStarted?: boolean
  REFRAME_MODELS?: Record<string, unknown>
}
