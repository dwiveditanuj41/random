import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Styled from 'styled-components';
import { Popup, Menu } from '@indshine/ui-kit';
import { get } from 'lodash-es';
import { toast } from 'react-toastify';

import useApi from '../../../hooks/useApi';

const AccessDropdown = ({
  user,
  access,
  setProjectData,
  currentUserCanView,
  currentUser,
  trigger,
}) => {
  const [popupOpen, setPopupOpen] = useState(false);

  const api = useApi();

  const disabled =
    user.accessType.id === 'owner' ||
    currentUserCanView ||
    currentUser.email === user.email;

  return (
    <StyledPopup
      hideOnScroll
      trigger={React.cloneElement(trigger, {
        disabled,
      })}
      open={popupOpen}
      on="click"
      onOpen={() => setPopupOpen(true)}
      onClose={() => {
        setPopupOpen(false);
      }}
      disabled={disabled}
    >
      <Menu vertical secondary compact>
        {access.map(permission => {
          if (permission.id !== 'owner') {
            return (
              <Menu.Item
                key={permission.id}
                name={permission.name}
                content={permission.name}
                value={permission.name}
                onClick={async () => {
                  setPopupOpen(false);
                  setProjectData(projectState => ({
                    ...projectState,
                    memberAccess: projectState.memberAccess.map(member => {
                      if (member.id === user.id) {
                        return {
                          ...member,
                          accessType: permission,
                        };
                      }
                      return member;
                    }),
                  }));
                  try {
                    await api.put(`/access/${user.id}`, {
                      accessType: {
                        id: permission.id,
                      },
                    });
                  } catch (error) {
                    const errorMessage = get(
                      error,
                      'response.data',
                      'Something went wrong. Please try again',
                    );
                    toast.error(errorMessage);
                  }
                }}
              />
            );
          }
          return null;
        })}
        <Menu.Item
          name="Remove"
          content="Remove"
          onClick={async () => {
            try {
              setPopupOpen(false);
              setProjectData(stateProjectData => ({
                ...stateProjectData,
                memberAccess: stateProjectData.memberAccess.filter(
                  member => member.id !== user.id,
                ),
              }));
              await api.delete(`/access/${user.id}`);
            } catch (error) {
              // Validation Handling
              const errorMessage = get(
                error,
                'response.data',
                'Something went wrong. Please try again',
              );
              toast.error(errorMessage);
            }
          }}
        />
      </Menu>
    </StyledPopup>
  );
};

AccessDropdown.propTypes = {
  user: PropTypes.object,
  access: PropTypes.array,
  setProjectData: PropTypes.func,
  currentUserCanView: PropTypes.bool,
  currentUser: PropTypes.object.isRequired,
  trigger: PropTypes.object.isRequired,
};

AccessDropdown.defaultProps = {
  currentUserCanView: null,
  user: null,
  access: null,
  setProjectData: () => {},
};

export default AccessDropdown;

const StyledPopup = Styled(Popup)`
 padding:0 !important;
`;
