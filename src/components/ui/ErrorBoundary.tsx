import { Component, type ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallbackTitle?: string
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center bg-mist text-ink">
          <div className="max-w-md p-6 rounded-2xl border border-line bg-white shadow-card">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-forest/10 text-forest mb-4 font-mono text-xl">
              !
            </div>
            <h2 className="text-xl font-semibold text-forest mb-2">
              {this.props.fallbackTitle || 'Something went wrong'}
            </h2>
            <p className="text-sm text-ink/70 mb-6">
              {this.state.error?.message || 'An unexpected rendering error occurred.'}
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => {
                  this.setState({ hasError: false })
                  window.location.reload()
                }}
                className="px-4 py-2 text-sm font-medium rounded-full bg-forest text-mist hover:bg-ink transition-colors"
              >
                Reload page
              </button>
              <button
                onClick={() => {
                  this.setState({ hasError: false })
                  window.location.hash = ''
                }}
                className="px-4 py-2 text-sm font-medium rounded-full border border-line text-ink hover:bg-mint/40 transition-colors"
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
