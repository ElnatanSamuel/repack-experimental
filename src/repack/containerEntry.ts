/**
 * No-op entry point used by remote mini-app containers.
 *
 * A container bundle must not boot a second React Native runtime inside the
 * host app: `InitializeCore` re-registers native modules, replaces the global
 * error handler and eagerly consumes shared modules, which makes the container
 * create its own share scope before the host can call `container.init(scope)`.
 *
 * The container therefore starts empty and only exposes its modules. The host
 * resolves them lazily via `container.get(...)`, after the share scope has been
 * initialized with the host's singletons.
 */
export {};
