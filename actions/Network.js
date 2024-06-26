/*
 * Copyright 2023 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
const AbortAddon = require('wretch/addons/abort');

const wretch = require('wretch');
const { retry } = require('wretch/middlewares/retry');
const { WretchError } = require('wretch');

const { Core } = require('@adobe/aio-sdk');

const logger = Core.Logger('FirefallAction');

const REQUEST_TIMEOUT = 55 * 1000;

function createWretchError(status, message) {
  const error = new WretchError();
  error.status = status;
  error.message = message;
  return error;
}

function wretchWithOptions(url, shouldRetry = false) {
  return wretch(url)
    .middlewares(shouldRetry ? [retry()] : [])
    .addon(AbortAddon())
    .resolve((resolver) => resolver.setTimeout(REQUEST_TIMEOUT))
    .resolve((resolver) => {
      return resolver.fetchError((error) => {
        if (error.name === 'AbortError') {
          logger.error('Request aborted', error);
          throw createWretchError(408, 'Request timed out');
        }
        logger.error('Network error', error);
        throw createWretchError(500, 'Network error');
      });
    });
}

module.exports = wretchWithOptions;
