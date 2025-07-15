import fetch from 'node-fetch';
import { fetchJobs, Job } from '../fetchJobs';

jest.mock('node-fetch');
const { Response } = jest.requireActual('node-fetch');

describe('fetchJobs()', () => {
  const mockApiResponse = {
    results: [
      {
        title: 'Senior PM',
        company: { display_name: 'Acme Corp' },
        description: 'Manage stuff',
        salary_min: 90000,
        salary_max: 120000,
        salary_is_predicted: false,
        contract_type: 'Full-time',
        contract_time: 'Permanent',
        location: { display_name: 'Remote' },
        created: '2025-07-14T12:00:00Z',
        redirect_url: 'https://example.com/job/123',
      }
    ]
  };

  beforeEach(() => {
    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValue(
      new Response(JSON.stringify(mockApiResponse))
    );
  });

  it('builds the correct URL and maps the response', async () => {
    const params = { title: 'PM', location: 'Anywhere', radius: 0, days_old: 1, page: 1 };
    const jobs = await fetchJobs(params);

    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining(
        '/us/search/1?app_id='
        + '&app_key='
        + '&what=PM'
        + '&where=Anywhere'
        + '&max_days_old=1'
        + '&results_per_page=50'
      )
    );

    expect(jobs).toEqual<Job[]>([
      {
        title: 'Senior PM',
        company: 'Acme Corp',
        description: 'Manage stuff',
        salary_min: 90000,
        salary_max: 120000,
        salary_pred: false,
        contract_type: 'Full-time',
        contract_time: 'Permanent',
        location: 'Remote',
        date_posted: '2025-07-14T12:00:00Z',
        url: 'https://example.com/job/123',
      }
    ]);
  });
});
