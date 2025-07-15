import { renderJobsHTML } from '../renderJobs';
import { Job } from '../fetchJobs';

describe('renderJobsHTML()', () => {
  it('renders a table with the correct columns and data', () => {
    const jobs: Job[] = [
      {
        title: 'Senior PM',
        company: 'Acme Corp',
        location: 'Remote',
        contract_type: 'Full-time',
        contract_time: 'Permanent',
        date_posted: '2025-07-14T12:00:00Z',
        description: 'Lead product development across teams.',
        salary_min: 90000,
        salary_max: 120000,
        salary_pred: true,
        url: 'https://example.com/job/123',
      }
    ];

    const html = renderJobsHTML(jobs);
    expect(html).toContain('<table');
    expect(html).toContain('<thead>');
    expect(html).toContain('<tbody>');
    ['Title &amp; Company','Location','Contract','Date Posted','Description','Salary']
      .forEach(header => expect(html).toContain(header));
    expect(html).toContain('Senior PM');
    expect(html).toContain('Acme Corp');
    expect(html).toContain('Remote');
    expect(html).toContain('Full-time / Permanent');
    expect(html).toContain('2025-07-14');
    expect(html).toContain('Lead product development');
    expect(html).toContain('$90,000');
    expect(html).toContain('$120,000');
    expect(html).toContain('href="https://example.com/job/123"');
  });
});
