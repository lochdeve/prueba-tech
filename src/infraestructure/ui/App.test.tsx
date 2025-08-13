import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the TextList component
jest.mock('./components/TextList', () => {
  return function MockTextList() {
    return <div data-testid='mock-text-list'>Mock TextList Component</div>;
  };
});

describe('App', () => {
  it('should render the TextList component', () => {
    render(<App />);

    expect(screen.getByTestId('mock-text-list')).toBeInTheDocument();
  });

  it('should render without crashing', () => {
    expect(() => render(<App />)).not.toThrow();
  });

  it('should have the correct structure', () => {
    const { container } = render(<App />);

    // App should render a single root element
    expect(container.firstChild).toBeInTheDocument();
  });
});
