import { createSelector } from '@reduxjs/toolkit';
import { repositoryDefinitions } from './repositories.js';
const names = Object.keys(repositoryDefinitions);
export const selectRepositories = createSelector(names.map(name => state => state[name]), (...values) => Object.fromEntries(names.map((name, index) => [name, values[index]])));
