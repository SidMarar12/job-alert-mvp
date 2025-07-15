/**
 * @jest-environment jsdom
 */
import fs from 'fs';
import path from 'path';
import { fireEvent, getByTestId } from '@testing-library/dom';
import '@testing-library/jest-dom';

// load our HTML
const html = fs.readFileSync(path.resolve(__dirname, '../../index.html'), 'utf8');

describe('App integration', () => {
  beforeEach(() => {
    document.body.innerHTML = html;
    // load our compiled app.js (make sure you've run `tsc`)
    require('../../dist/app.js');
  });

  it('renders the form and responds to submit', () => {
    const form = getByTestId(document.body, 'profile-form');
    expect(form).toBeInTheDocument();
    // simulate submit without filling required => should block
    fireEvent.submit(form);
    // we won’t actually call fetch, but at least no crash
    expect(document.getElementById('results')).toBeInTheDocument();
  });
});
