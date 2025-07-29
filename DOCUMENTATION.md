# Comprehensive Documentation

This document provides an overview of the **public APIs**, **services**, and **React components** contained in this code-base.  Each entry lists the purpose, public interface (props / parameters / return-value), and a concise example that demonstrates typical usage.

---

## Table of Contents

1.  Services / Remote API Helpers
    1.  [`countriesService`](#countriesservice)
    2.  [`relService`](#relservice)
    3.  [`currencyService`](#currencyservice)
    4.  [`loginService`](#loginservice)
    5.  [`registerService`](#registerservice)
    6.  [`saveBlocService`](#saveblocservice)
    7.  [`getBlocsService`](#getblocsservice)
2.  React Components
    1.  [`App`](#app-root-component)
    2.  [`Map3`](#map3)
    3.  [`CountryDetails`](#countrydetails)
    4.  [`SelectedFlags`](#selectedflags)
    5.  [`Filter`](#filter)
    6.  [`CountriesDropdown`](#countriesdropdown)
    7.  [`SaveBlocForm`](#saveblocform)
    8.  [`LoginForm`](#loginform)
    9.  [`Footer`](#footer)

---

# 1. Services / Remote API Helpers

All services are **async** functions that return a Promise.  They act as a thin wrapper around HTTP requests using `axios`.

### `countriesService`

Fetches the complete list of countries (REST Countries v3.1).

```js
import { countriesService } from "./services/countriesService";

(async () => {
  const countries = await countriesService();
  console.log(countries[0]);
})();
```

| Parameter | Type | Description |
|-----------|------|-------------|
| –         | –    | None        |

**Returns**: `Array<Country>` – raw data from REST Countries or local JSON fallback (`src/all.json`).

---

### `relService`

Retrieves religion information per country.

```js
import { relService } from "./services/relService";

const religions = await relService();
```

Returns `Array<{ country: string; religion: string }>`.

---

### `currencyService`

(Currently commented-out in the code but preserved for completeness.)  Would fetch an array of currency codes.

```js
// import { currencyService } from "./services/currencyService";
// const currencies = await currencyService();
```

---

### `loginService`

Authenticates a user.

```js
import { loginService } from "./services/loginService";

const user = await loginService({
  username: "demo",
  password: "secret",
});
```

| Param | Type | Description |
|-------|------|-------------|
| `loginObject` | `{ username: string; password: string }` | Credentials |

Returns an array where one element contains `{ token: string }` on success.  Errors are returned as objects with an `error` field.

---

### `registerService`

Creates a new user.

```js
import { registerService } from "./services/loginService";

await registerService({ username: "demo", password: "secret" });
```

On success the API returns an empty array; on validation failure the array contains validation errors.

---

### `saveBlocService`

Persists a custom "bloc" (collection of countries) for the authenticated user.

```js
import { saveBlocService } from "./services/blocService";

await saveBlocService(
  { name: "Nordic", countries: ["fi", "se", "no"] },
  `bearer ${token}`
);
```

---

### `getBlocsService`

Retrieves all blocs that belong to the authenticated user.

```js
const blocs = await getBlocsService(`bearer ${token}`);
```

---

# 2. React Components

All components are written in React **function-component** style and are exported as the default export of their file.

## `App` (root component)

Entry point that orchestrates data fetching, state management, and renders the rest of the UI.  Holds the following top-level state variables:

* `countries`, `religions`, `blocs`
* UI state such as `selected`, `mapColor`, `showDetail`, etc.

Usage: rendered automatically by `index.js` (the CRA entry point).

---

## `Map3`

SVG world map with interactive countries.

**Props**

| Prop | Type | Description |
|------|------|-------------|
| `mapColor` | `Array<{ id: string; color: string }>` | Per-country fill colors |
| `mode` | `boolean` | `true` = light, `false` = dark background |
| `clickOne` | `(countryCode: string) => void` | Click handler |

Example:

```jsx
<Map3 mapColor={mapColor} mode={mode} clickOne={handleClick} />
```

---

## `CountryDetails`

Displays an information card for a single country, including flag, coat-of-arms, demographic data and utility links.

**Key Props**

| Prop | Description |
|------|-------------|
| `countries` | Raw countries list from `countriesService` |
| `showDetail` | ISO-alpha-2 code of the country to show |
| `mapColor` | Same structure as in `Map3` (for border highlight) |
| `selected`, `selectOne`, `dkd` | Selection helpers supplied by `App` |
| `religions` | Data from `relService` |

---

## `SelectedFlags`

Renders a sortable list of selected country names / flags.

Props: `countries`, `selected`, `mapColor`, `setShowDetail`.

Example:

```jsx
<SelectedFlags
  countries={countries}
  selected={selected}
  mapColor={mapColor}
  setShowDetail={setShowDetail}
/>
```

---

## `Filter`

Text input that performs live search across country names and updates the detail panel once an unambiguous match is found.

Props: `countries`, `showDetail`, `setShowDetail` (callback), `selected`, `dkd` (deselect-keep-details helper).

---

## `CountriesDropdown`

Hierarchical dropdown for selecting countries by region / sub-region or user-defined blocs.

Props include:

* `countries`
* `selectOne(ids)` – select a single country
* `selectMany(ids)` – select an array
* `blocs` – user-saved blocs
* `user` – current user object

---

## `SaveBlocForm`

Dialog for persisting the current selection as a *bloc*.

Props: `selected`, `user`, `updateBlocList`.

---

## `LoginForm`

Handles authentication and (optionally) user registration.  Persists the JWT token in `localStorage` and populates `App`'s `user` state on success.

Key Props: `user`, `setUser`, `setBlocs`.

Example usage is in `App`:

```jsx
<LoginForm user={user} setUser={setUser} setBlocs={setBlocs} />
```

---

## `Footer`

Static footer with project credits.

---

# Running the project

```bash
npm install
npm start
```

Navigate to `http://localhost:3000`.

---

# Contributing

1.  Fork & clone the repository.
2.  Follow the coding style of existing components.
3.  Update unit tests and documentation where appropriate.

---

# License

MIT