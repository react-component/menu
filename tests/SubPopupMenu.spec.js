import { saveRef } from '../src/SubPopupMenu';

describe('SubPopupMenu saveRef', () => {
  let subPopupMenu;


  beforeEach(() => {
    subPopupMenu = { instanceArray: [] };
  });

  it('saveRef should add new component ref', () => {
    saveRef.call(subPopupMenu, { props: { eventKey: '1' } });

    expect(subPopupMenu.instanceArray).toEqual([{ props: { eventKey: '1' } }]);
  });

  it('saveRef should update component ref', () => {
    const c = { props: { eventKey: '1', name: 'old' } };
    subPopupMenu.instanceArray[0] = c;
    saveRef.call(subPopupMenu, c);

    expect(subPopupMenu.instanceArray).toEqual([c]);
  });
});
