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
import React, { useEffect } from 'react';
import { View } from '@adobe/react-spectrum';
/* eslint-disable-next-line import/no-named-default */
import { default as SimpleEditor } from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import 'prismjs/themes/prism.css';
import { parseExpressions } from '../helpers/ExpressionParser.js';
import { renderExpressions } from '../helpers/ExpressionRenderer.js';

import { showPromptState } from '../state/ShowPromptState.js';
import { sourceViewState } from '../state/SourceViewState.js';
import { promptState } from '../state/PromptState.js';
import { expressionsState } from '../state/ExpressionsState.js';
import { parametersState } from '../state/ParametersState.js';
import { promptTemplateState } from '../state/PromptTemplateState.js';

languages.custom = {
  function: /{[^@#]([^{}]+)}/,
  keyword: /{@([^{}]+)}/,
  regex: /<please select>/,
  comment: /{#([^{}]+)}/,
};

function Editor(props) {
  const setExpressions = useSetRecoilState(expressionsState);
  const [sourceView, setSourceView] = useRecoilState(sourceViewState);
  const promptTemplate = useRecoilValue(promptTemplateState);
  const [prompt, setPrompt] = useRecoilState(promptState);
  const parameters = useRecoilValue(parametersState);
  const showPrompt = useRecoilValue(showPromptState);

  useEffect(() => {
    if (promptTemplate) {
      setPrompt(promptTemplate.value);
      setSourceView(false);
    }
  }, [promptTemplate, setPrompt]);

  useEffect(() => {
    setExpressions(parseExpressions(prompt));
  }, [prompt, setExpressions]);

  return (
    <View
      {...props}
      // isHidden={!showPrompt}
      UNSAFE_className={['editor-container', sourceView ? 'editable' : ''].join(' ')}>
      <SimpleEditor
        className="editor"
        value={sourceView ? prompt : renderExpressions(prompt, parameters)}
        onValueChange={setPrompt}
        highlight={(code) => highlight(code, languages.custom, 'custom')}
        readOnly={!sourceView}
      />
    </View>
  );
}

export default Editor;
