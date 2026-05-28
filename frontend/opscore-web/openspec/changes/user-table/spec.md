# Delta for Users

## MODIFIED Requirements

### Requirement: User Page Tabs
The system MUST render tabs for "Operadores" and "Supervisores" on the UserPage, with the active tab highlighted.

#### Scenario: Verify tabs existence and state
- GIVEN the user is on the UserPage
- THEN the tabs "Operadores" and "Supervisores" are visible
- AND the "Operadores" tab is highlighted as active by default

### Requirement: Tab-Based Data Selection
The system MUST display the corresponding mock dataset in the table based on the active tab.

#### Scenario: Switch to Supervisores
- GIVEN the user is on the UserPage viewing the "Operadores" tab
- WHEN the user clicks the "Supervisores" tab
- THEN the active tab switches to "Supervisores"
- AND the table updates to display the Supervisores mock dataset

### Requirement: Table Columns
The system MUST display the following columns in the user table: ID, Área, Legajo, Nombre, Apellido, Email, Teléfono, Acciones.

#### Scenario: Verify table columns
- GIVEN the user is viewing the user table
- THEN the headers ID, Área, Legajo, Nombre, Apellido, Email, Teléfono, and Acciones are displayed

### Requirement: Client-Side Search
The system MUST provide a search bar with the placeholder "Buscar por ID, nombre o legajo..." that filters table rows client-side.

#### Scenario: Filter users by search query
- GIVEN the user is viewing the user table with mock data
- WHEN the user types a query in the search bar
- THEN the table rows are instantly filtered to only show users whose ID, nombre, or legajo match the query

### Requirement: Filter Button Visibility
The system MUST display a "Filtros" button on the page.

#### Scenario: Verify Filtros button
- GIVEN the user is on the UserPage
- THEN the "Filtros" button is visible
- AND clicking the button does nothing (non-functional for now)

### Requirement: Add User Button Visibility
The system MUST display an "Agregar usuario" button at the top-right of the page.

#### Scenario: Verify Agregar usuario button
- GIVEN the user is on the UserPage
- THEN the "Agregar usuario" button is visible at the top-right
- AND clicking the button does nothing (non-functional for now)

### Requirement: Pagination
The system MUST paginate the table data, displaying exactly 5 rows per page, with a counter reading "Mostrando X a Y de Z usuarios" at the bottom-left and page number buttons at the bottom-right.

#### Scenario: Verify pagination controls and limits
- GIVEN the dataset contains more than 5 users
- THEN only the first 5 rows are displayed in the table
- AND the text "Mostrando X a Y de Z usuarios" is visible at the bottom-left
- AND the page number buttons are visible at the bottom-right

### Requirement: Row Actions Menu
The system MUST display an options icon ("⋮") in the Acciones column for each row.

#### Scenario: Verify row actions
- GIVEN the table has rows of users
- THEN each row displays a "⋮" icon in the Acciones column
- AND interacting with the icon does nothing (non-functional for now)

### Requirement: Inactive Users Presentation
The system MUST visually distinguish inactive users by applying reduced opacity and a strikethrough on the name and surname.

#### Scenario: View inactive user
- GIVEN the table displays a user whose active status is false
- THEN the row is visually muted with reduced opacity
- AND the user's name and surname have a strikethrough effect applied

### Requirement: Mock Data Composition
The system MUST initialize mock datasets containing exactly 5 operators and 5 supervisors, ensuring at least one inactive user in each group.

#### Scenario: Verify mock datasets
- GIVEN the system loads the mock data for the UserPage
- THEN there are exactly 5 operator records
- AND exactly 5 supervisor records
- AND at least 1 operator is marked as inactive
- AND at least 1 supervisor is marked as inactive
