import { useState, useEffect } from 'react'
import personService from './services/persons'
import Notification from './Notification'

const Filter = ({ search, handleSearchChange }) => {
  return (
    <div>
      filter shown with{' '}
      <input
        value={search}
        onChange={handleSearchChange}
      />
    </div>
  )
}

const PersonForm = ({
  newName,
  newNumber,
  handleNameChange,
  handleNumberChange,
  addName
}) => {
  return (
    <form onSubmit={addName}>
      <div>
        name:{' '}
        <input
          value={newName}
          onChange={handleNameChange}
        />
      </div>

      <div>
        number:{' '}
        <input
          value={newNumber}
          onChange={handleNumberChange}
        />
      </div>

      <div>
        <button type="submit">add</button>
      </div>
    </form>
  )
}

const Persons = ({ persons, removePerson }) => {
  return (
    <div>
      {persons.map(person => (
        <p key={person.id}>
          {person.name} {person.number}{' '}
          <button onClick={() => removePerson(person)}>
            delete
          </button>
        </p>
      ))}
    </div>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setSearch] = useState('')
  const [notification, setNotification] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    personService
      .getAll()
      .then(data => {
        setPersons(data)
      })
  }, [])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearchChange = (event) => {
    setSearch(event.target.value)
  }

  const showNotification = (message) => {
    setNotification(message)
    setError(false)

    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const showError = (message) => {
    setNotification(message)
    setError(true)

    setTimeout(() => {
      setNotification(null)
      setError(false)
    }, 5000)
  }

  const addName = (event) => {
    event.preventDefault()

    const person = persons.find(person => person.name === newName)

    if (person) {
      const confirmed = window.confirm(
        `${newName} is already added to phonebook. Replace the old number with the new one?`
      )

      if (!confirmed) {
        return
      }

      const changedPerson = {
        ...person,
        number: newNumber
      }

      personService
        .update(person.id, changedPerson)
        .then(data => {
          setPersons(
            persons.map(person =>
              person.id === data.id ? data : person
            )
          )

          setNewName('')
          setNewNumber('')
          showNotification(`${data.name} number updated`)
        })
        .catch(error => {
          showError(
            `Information of ${person.name} was already removed from server`
          )

          setPersons(
            persons.filter(p => p.id !== person.id)
          )
        })

      return
    }

    const personObject = {
      name: newName,
      number: newNumber
    }

    personService
      .create(personObject)
      .then(data => {
        setPersons(persons.concat(data))
        setNewName('')
        setNewNumber('')
        showNotification(`${data.name} added`)
      })
  }

  const removePerson = (person) => {
    const confirmed = window.confirm(
      `Delete ${person.name}?`
    )

    if (!confirmed) {
      return
    }

    personService
      .remove(person.id)
      .then(() => {
        setPersons(
          persons.filter(p => p.id !== person.id)
        )
      })
  }

  const personsToShow = persons.filter(person =>
    person.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification
        message={notification}
        error={error}
      />

      <Filter
        search={search}
        handleSearchChange={handleSearchChange}
      />

      <h2>Add a new</h2>

      <PersonForm
        newName={newName}
        newNumber={newNumber}
        handleNameChange={handleNameChange}
        handleNumberChange={handleNumberChange}
        addName={addName}
      />

      <h2>Numbers</h2>

      <Persons
        persons={personsToShow}
        removePerson={removePerson}
      />
    </div>
  )
}

export default App