import React, { useState } from 'react'
import { Form, FormGroup, Input, Button } from 'reactstrap'

import { axiosWithAuth } from '../utils/axiosWithAuth'

const initialColor = {
  color: '',
  code: { hex: '' }
}

const ColorList = ({ colors, updateColors }) => {
  const [editing, setEditing] = useState(false)
  const [colorToEdit, setColorToEdit] = useState(initialColor)
  const [id, setId] = useState(null)
  const [colorToAdd, setColorToAdd] = useState(initialColor)

  const editColor = color => {
    setEditing(true)
    setColorToEdit(color)
    setId(color.id)
  }

  const saveEdit = e => {
    e.preventDefault()

    // Make a put request to save your updated color
    // think about where will you get the id from...
    // where is is saved right now?
    axiosWithAuth()
      .put(`/colors/${id}`, colorToEdit)
      .then(res => {
        const newColors = colors.map(color => {
          if (color.id === res.data.id) return res.data
          return color
        })
        updateColors(newColors)
        setEditing(false)
      })
      .catch(err => console.log(err.response.data.error))
  }

  const deleteColor = color => {

    // make a delete request to delete this color
    axiosWithAuth()
      .delete(`/colors/${color.id}`)
      .then(res => {
        const newColors = colors.filter(c => c.id !== color.id)
        updateColors(newColors)
      })
      .catch(err => console.log(err.response.data.error))
  }

  const addColor = e => {
    e.preventDefault()

    axiosWithAuth()
      .post('/colors', colorToAdd)
      .then(res => {
        updateColors(res.data)
        setColorToAdd(initialColor)
      })
      .catch(err => console.log(err.response.data.error))
  }

  return (
    <div className='colors-wrap'>

      {/* Add Color form */}
      <Form onSubmit={addColor}>
        <Button>Add</Button>
        <FormGroup>
          <Input
            type='text'
            name='color'
            placeholder='color name'
            onChange={e =>
              setColorToAdd({
                ...colorToAdd, color: e.target.value
              })
            }
            value={colorToAdd.color}
          />
          <Input
            type='text'
            name='hex-code'
            placeholder='hex-code'
            onChange={e =>
              setColorToAdd({
                ...colorToAdd, code: { hex: e.target.value }
              })
            }
            value={colorToAdd.code.hex}
          />
        </FormGroup>
      </Form>
      <h2>COLORS</h2>
      {editing && (
        <form onSubmit={saveEdit}>
          <legend>edit color</legend>
          <label>
            color name:
            <input
              onChange={e =>
                setColorToEdit({
                  ...colorToEdit, color: e.target.value
                })
              }
              value={colorToEdit.color}
            />
          </label>
          <label>
            hex code:
            <input
              onChange={e =>
                setColorToEdit({
                  ...colorToEdit, code: { hex: e.target.value }
                })
              }
              value={colorToEdit.code.hex}
            />
          </label>
          <div className='button-row'>
            <button type='submit'>save</button>
            <button onClick={() =>setEditing(false)}>
              cancel
            </button>
          </div>
        </form>
      )}
      <ul>
        {colors.map(color => (
          <li key={color.color} onClick={() => editColor(color)}>
            <span>
              <span className='delete' onClick={e => {
                    e.stopPropagation()
                    deleteColor(color)
                  }
                }>
                  x
              </span>{' '}
              {color.color}
            </span>
            <div
              className='color-box'
              style={{ backgroundColor: color.code.hex }}
            />
          </li>
        ))}
      </ul>
      <div className='spacer' />
      {/* stretch - build another form here to add a color */}
    </div>
  )
}

export default ColorList