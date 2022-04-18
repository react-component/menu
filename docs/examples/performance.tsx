import * as React from 'react'
import Menu from '../../src/Menu'
import SubMenu from '../../src/SubMenu'
import MenuItem from '../../src/MenuItem'
import type { MenuMode } from '../../src/interface'

const count = 50

const Performance = () => {
  const [mode, setMode] = React.useState<MenuMode>('vertical')

  return (
    <div>
      <div>
        mode: <select
          style={{ marginRight: 20 }}
          value={mode}
          onChange={e => setMode(e.target.value as MenuMode)}
        >
          <option value="inline">inline</option>
          <option value="vertical">vertical</option>
          <option value="horizontal">horizontal</option>
        </select>
      </div>

      <div style={{ width: 200 }}>
        <Menu
          mode={mode}
          defaultSelectedKeys={['0', '0 - 0']}
        >
          {new Array(count).fill(0).map((m, i) => {
            const title = 'item - ' + i

            return (
              <SubMenu key={i} title={title}>
                {new Array(count).fill(0).map((n, index) => {
                  const key = i + ' - ' + index
                  const subTitle = title + ' - ' + index

                  return (
                    <MenuItem key={key}>{subTitle}</MenuItem>
                  )
                })}
              </SubMenu>
            )
          })}
        </Menu>
      </div>
    </div>
  )
}

export default Performance
