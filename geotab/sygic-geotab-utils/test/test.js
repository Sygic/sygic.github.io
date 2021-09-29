const assert = require('chai').assert;

const { User } = require('../lib/utils.js');
const _ = require('underscore');

function createUser() {
  if (arguments.length > 1)
    throw new Error('User should have only 1 security group assigned');
  let args = [...arguments];
  return { securityGroups: [...args.map((a) => ({ id: a }))] };
}

describe('User security tests', () => {
  it('empty user should not have acces to anything', () => {
    let user = new User({ securityGroups: [] }, []);
    assert.isFalse(user.canModify);
    assert.isFalse(user.canView);
  });

  it('inherited securitygroups - should resolve filters - allow all', () => {
    let allSecurityGroups = [
      {
        id: 'Viewer',
        securityFilters: [
          { securityIdentifier: 'DeviceList', isAdd: true },
          { securityIdentifier: 'ViewAddInData', isAdd: true },
        ],
      },
      {
        id: 'Admin',
        securityFilters: [
          { securityIdentifier: 'DeviceAdmin', isAdd: true },
          { securityIdentifier: 'ManageAddInData', isAdd: true },
        ],
        children: [{ id: 'Viewer' }],
      },
    ];
    let user = new User(createUser('Viewer'), allSecurityGroups);
    assert.isTrue(user.canModify);
    assert.isTrue(user.canView);
  });
  
  it('single securitygroup - no filters - deny all', () => {
    let allSecurityGroups = [
      {
        id: 'Admin',
        securityFilters: [],
      },
    ];
    let user = new User(createUser('Admin'), allSecurityGroups);
    assert.isFalse(user.canModify);
    assert.isFalse(user.canView);
  })

  it('inherited securitygroups - should resolve filters - override deny', () => {
    let allSecurityGroups = [
      {
        id: 'Viewer',
        securityFilters: [{ securityIdentifier: 'DeviceAdmin', isAdd: false }],
      },
      {
        id: 'Admin',
        securityFilters: [
          { securityIdentifier: 'DeviceList', isAdd: true },
          { securityIdentifier: 'DeviceAdmin', isAdd: true },
          { securityIdentifier: 'ViewAddInData', isAdd: true },
          { securityIdentifier: 'ManageAddInData', isAdd: true },
        ],
        children: [{ id: 'Viewer' }],
      },
    ];
    let user = new User(createUser('Viewer'), allSecurityGroups);
    assert.isFalse(user.canModify);
    assert.isTrue(user.canView);
  });

  it('inherited securitygroups - should resolve filters - override allow', () => {
    let allSecurityGroups = [
      {
        id: 'Viewer',
        securityFilters: [{ securityIdentifier: 'DeviceAdmin', isAdd: true }],
      },
      {
        id: 'Admin',
        securityFilters: [
          { securityIdentifier: 'DeviceList', isAdd: true },
          { securityIdentifier: 'DeviceAdmin', isAdd: false },
          { securityIdentifier: 'ViewAddInData', isAdd: true },
          { securityIdentifier: 'ManageAddInData', isAdd: true },
        ],
        children: [{ id: 'Viewer' }],
      },
      {
        id: 'EverythingGroup',
        securityFilters: [{ securityIdentifier: 'Everything', isAdd: true }],
        children: [{ id: 'Admin' }],
      },
    ];
    let user = new User(createUser('Viewer'), allSecurityGroups);
    assert.isTrue(user.canModify);
    assert.isTrue(user.canView);
  });

  it('everything securitygroup - allow all', () => {
    let allSecurityGroups = [
      {
        id: 'Viewer',
        securityFilters: [{ securityIdentifier: 'DeviceAdmin', isAdd: true }],
      },
      {
        id: 'Admin',
        securityFilters: [
          { securityIdentifier: 'DeviceList', isAdd: true },
          { securityIdentifier: 'DeviceAdmin', isAdd: false },
          { securityIdentifier: 'ViewAddInData', isAdd: true },
          { securityIdentifier: 'ManageAddInData', isAdd: true },
        ],
        children: [{ id: 'Viewer' }],
      },
      {
        id: 'EverythingGroup',
        securityFilters: [{ securityIdentifier: 'Everything', isAdd: true }],
        children: [{ id: 'Admin' }],
      },
    ];
    let user = new User(createUser('EverythingGroup'), allSecurityGroups);
    assert.isTrue(user.canModify);
    assert.isTrue(user.canView);
  });

  it('isAdd==false override should cancel parent \'Everything\' group', () => {
    let allSecurityGroups = [
      {
        id: 'Admin',
        securityFilters: [
          { securityIdentifier: 'DeviceList', isAdd: true },
          { securityIdentifier: 'DeviceAdmin', isAdd: false },
          { securityIdentifier: 'ViewAddInData', isAdd: true },
          { securityIdentifier: 'ManageAddInData', isAdd: true },
        ],
        children: [{ id: 'Viewer' }],
      },
      {
        id: 'EverythingGroup',
        securityFilters: [{ securityIdentifier: 'Everything', isAdd: true }],
        children: [{ id: 'Admin' }],
      },
    ];
    let user = new User(createUser('Admin'), allSecurityGroups);
    assert.isFalse(user.canModify);
    assert.isTrue(user.canView);
  });
});
