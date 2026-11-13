import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Header from './Header';

describe('Header', () => {
  afterEach(cleanup);

  it('shows the Dodgy Ducks branding', () => {
    render(<Header canEdit={false} isEditMode={false} onToggleEdit={vi.fn()} />);

    expect(screen.getByRole('heading', { name: 'Dodgy Ducks' })).toBeInTheDocument();
    expect(screen.getByAltText(/Dodgy Ducks/)).toBeInTheDocument();
  });

  it('navigates home when the brand is clicked', () => {
    const onTabChange = vi.fn();
    render(<Header canEdit={false} isEditMode={false} onToggleEdit={vi.fn()} onTabChange={onTabChange} activeTab='constitution' />);

    fireEvent.click(screen.getByLabelText('Dodgy Ducks home'));
    expect(onTabChange).toHaveBeenCalledWith('home');
  });

  it('hides edit controls when editing is not available', () => {
    render(<Header canEdit={false} isEditMode={false} onToggleEdit={vi.fn()} />);

    expect(screen.queryByText('🔒 Read-only')).not.toBeInTheDocument();
    expect(screen.queryByText('✏️ Enable Editing')).not.toBeInTheDocument();
  });

  it('allows toggling edit mode in local development', () => {
    const onToggleEdit = vi.fn();
    render(<Header canEdit isEditMode={false} onToggleEdit={onToggleEdit} />);

    fireEvent.click(screen.getByText('✏️ Enable Editing'));
    expect(onToggleEdit).toHaveBeenCalledTimes(1);
  });
});
