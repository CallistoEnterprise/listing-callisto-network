import type { Handler, HandlerEvent } from '@netlify/functions'
import { Octokit } from 'octokit'

const handler: Handler = async (event: HandlerEvent) => {
  // create test PR
  const octokit = new Octokit({
    auth: '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',
  })

  // create a new file with request data
  await octokit.request('PUT /repos/CallistoEnterprise/library-assetslist/contents/form-requests/test.md', {
    owner: 'CallistoEnterprise',
    repo: 'library-assetslist',
    path: 'form-requests/test.md',
    message: 'New Listing Request SYM',
    committer: {
      name: 'Callisto Listing FE',
      email: 'listing-callisto@callisto-enterprise.com',
    },
    content: 'IyMgTmV3IExpc3RpbmcgUmVxdWVzdCBTWU0KCiMjIyBBc3NldCBpbmZvcm1hdGlvbgotICoqbmFtZSoqOiBBc3NldCBuYW1lCi0gKipzeW1ib2wqKjogU1lNCi0gKipjb250cmFjdCBhZGRyZXNzKio6IDB4MDAwMAotICoqY2hhaW4qKjogQ2FsbGlzdG8KLSAqKmljb24qKjogaHR0cHM6Ly8uLi4uLi4KCiMjIyBQcm9qZWN0IGluZm9ybWF0aW9uCi0gKip3ZWJzaXRlKio6IGh0dHBzOi8vLi4uLgotICoqYWJvdXQqKjogTG9yZW0gaXBzdW0gZG9sb3JlcyBMb3JlbSBpcHN1bSBkb2xvcmVzIExvcmVtIGlwc3VtIGRvbG9yZXMgTG9yZW0gaXBzdW0gZG9sb3JlcwoKIyMjIENvbnRhY3QgaW5mb3JtYXRpb24KLSAqKmUtbWFpbCoqOiBqb2huQGRvZS5jb20KLSAqKnRlbGVncmFtKio6IEBqb2huRG9lCi0gKipkaXNjb3JkKio6IC0tLQoKIyMjIExpc3RpbmcgZGV0YWlscwotICoqcGxhdGZvcm1zKio6IGh1Yiwgc295LCBicmlkZ2UKLSAqKmF1ZGl0Kio6IFlFUwotICoqZmFybSoqOiBZRVMgKHBhaXIgd2l0aCBCVVNEVCkKCiMjIyBQYXltZW50IGRldGFpbHMKLSAqKmFkZHJlc3MqKjogMHgwMDAKLSAqKmRlc3RpbmF0aW9uKio6IDB4RDgyMEE3Njk0RjI3NkQxNTJENUM0MzVGMEM4ZmI4NmIxNDc1MjI4NAotICoqYW1vdW50Kio6IDI0ODgzOSBTT1kKLSAqKlNPWSBwcmljZSoqOiAkMC4wMDQwMQotICoqdHggaGFzaCoqOiBbMHhjN2Y1MzM5MWJhZmIxNWJhMGQ0MjAwZDRlY2U2NzkyYmI1NWU1ZmRjNTRlYjc1ZDliNmU1ZmFlMDhlMzAxZmU2XShodHRwczovL2V4cGxvcmVyLmNhbGxpc3RvLm5ldHdvcmsvdHgvMHhjN2Y1MzM5MWJhZmIxNWJhMGQ0MjAwZDRlY2U2NzkyYmI1NWU1ZmRjNTRlYjc1ZDliNmU1ZmFlMDhlMzAxZmU2KQ==',
    branch: 'new-form-request-sym',
  })

  await octokit.request('POST /repos/CallistoEnterprise/library-assetslist/pulls', {
    owner: 'CallistoEnterprise',
    repo: 'library-assetslist',
    title: 'New Listing Request SYM',
    body: 'Please review all the data and include all related changes in this PR',
    head: 'new-form-request-sym',
    base: 'master',
  })

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Testing PR has been created!', body: event.body }),
  }
}

export { handler }
