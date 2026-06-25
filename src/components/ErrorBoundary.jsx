'use client'

import { Component } from 'react'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8f6f2] p-4">
          <div className="card max-w-lg w-full p-8 text-center anim-fade-in">
            <div className="text-4xl mb-4">🐛</div>
            <h1 className="text-xl font-bold font-serif text-[#1a1a1a] mb-2">页面出错了</h1>
            <p className="text-sm text-[#999] mb-4">错误信息：</p>
            <pre className="text-xs text-left bg-[#f5f0e8] p-4 rounded-xl overflow-auto max-h-[300px] text-[#c23531]">
              {this.state.error?.toString()}
              {'\n\n'}
              {this.state.error?.stack?.split('\n').slice(0, 5).join('\n')}
            </pre>
            <button onClick={() => { this.setState({ hasError: false, error: null }); window.location.reload() }}
              className="btn-primary mt-4">重新加载</button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
