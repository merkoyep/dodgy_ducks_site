import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import Header from './Header';

describe('Header', () => {
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
