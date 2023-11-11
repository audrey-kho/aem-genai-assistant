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

import React, { useEffect, useState } from 'react';
import {
  Item, TabList, TabPanels, Tabs, Text, View,
} from '@adobe/react-spectrum';

import AnnotatePen from '@spectrum-icons/workflow/AnnotatePen';
import Star from '@spectrum-icons/workflow/Star';

import { useRecoilValue } from 'recoil';
import VariationsSection from './VariationsSection.js';
import FavoritesSection from './FavoritesSection.js';
import { LOCAL_STORAGE_KEY } from '../constants/Constants.js';
import { newVariationsSelector } from '../state/NewVariationsSelector.js';

function ResultsView(props) {
  const newVariations = useRecoilValue(newVariationsSelector);
  const [variations, setVariations] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [tab, setTab] = useState('variations');

  // Effect to run on component mount to initialize favorites from local storage
  useEffect(() => {
    // Get the favorites from local storage
    const storedFavorites = localStorage.getItem(LOCAL_STORAGE_KEY);

    // If there are stored favorites, parse and set them as the initial state
    if (storedFavorites) {
      setFavorites(JSON.parse(storedFavorites));
      setTab('favorites');
    }
  }, []);

  useEffect(() => {
    setVariations(newVariations);
  }, [newVariations]);

  return (
    <View
      {...props}
      overflow="auto">
      <VariationsSection
        variations={variations}
        favorites={favorites}
        onVariationsChange={setVariations}
        onFavoritesChange={setFavorites} />
    </View>
  );
}

export default ResultsView;
