/* eslint-disable no-console */
import type { Handler, HandlerEvent } from '@netlify/functions'
import { Octokit } from '@octokit/core'
import type { FormRequest } from '~/models/FormRequest'

const handler: Handler = async (event: HandlerEvent) => {
  // create test PR
  const octokit = new Octokit({
    auth: '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',
  })

  const request = JSON.parse(event.body ?? '{}') as FormRequest

  // todo: VALIDATE DATA!

  const idBranchName = `form-request-${request.symbol}-${request.address.substring(request.address.length - 10, request.address.length)}`
  const requestBody = `
  ## New Listing Request ${request.symbol}
  > Created at: ${new Date()}

  ### Asset information
  - **name**: ${request.name}
  - **symbol**: ${request.symbol}
  - **contract address**: ${request.address}
  - **chain**: ${request.chainId}
  - **icon**: --- TBD
  
  ### Project information
  - **website**: ${request.website}
  - **about**: ${request.about}
  
  ### Contact information
  - **e-mail**: ${request.email}
  - **telegram**: @${request.telegram}
  - **discord**: ${request.discord}
  
  ### Listing details
  - **platforms**: ${request.includeHub ? 'HUB, ' : ''}${request.includeSoy ? 'SOY, ' : ''} ${request.includeBridge ? 'BRIDGE, ' : ''}
  - **audit**: ${request.securityAudit ? 'YES' : 'NO'}
  - **farm**: ${request.createFarm ? `YES (pair with ${request.farmToken})` : 'NO'}
  
  ### Payment details
  - **address**: ${request.address}
  - **destination**: ${request.payment.destination}
  - **amount**: ${request.payment.price} SOY
  - **SOY price**: $${request.payment.soyPrice}
  - **tx hash**: [${request.payment.txHash}](https://explorer.callisto.network/tx/${request.payment.txHash})  
  `

  // get main branch ref
  console.log('get main branch')
  const mainResponse = await octokit.request('GET /repos/CallistoEnterprise/library-assetslist/git/ref/heads/main', {
    owner: 'CallistoEnterprise',
    repo: 'library-assetslist',
    ref: 'refs/heads/main',
  })

  // create a new branch
  console.log('create new branch', idBranchName)
  await octokit.request('POST /repos/CallistoEnterprise/library-assetslist/git/refs', {
    owner: 'CallistoEnterprise',
    repo: 'library-assetslist',
    ref: `refs/heads/${idBranchName}`,
    sha: mainResponse.data.object.sha,
  })

  // create a new file with request data
  console.log('create a new file')
  await octokit.request(`PUT /repos/CallistoEnterprise/library-assetslist/contents/${idBranchName}.md`, {
    owner: 'CallistoEnterprise',
    repo: 'library-assetslist',
    path: `${idBranchName}.md`,
    message: `New Listing Request ${request.symbol}`,
    committer: {
      name: 'Callisto Listing FE',
      email: 'listing-callisto@callisto-enterprise.com',
    },
    content: btoa(requestBody),
    branch: idBranchName,
  })

  // create a pull request
  console.log('create a pull request')
  await octokit.request('POST /repos/CallistoEnterprise/library-assetslist/pulls', {
    owner: 'CallistoEnterprise',
    repo: 'library-assetslist',
    title: `New Listing Request ${request.symbol}`,
    body: requestBody,
    head: idBranchName,
    base: 'main',
  })

  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'PR has been created!' }),
  }
}

export { handler }
