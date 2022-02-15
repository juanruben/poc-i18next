import { Fab } from '@material-ui/core';
import { Add } from '@material-ui/icons';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { Button } from '@material-ui/core';
import { StylesProvider } from '@material-ui/styles';

import './List.css';
import { Alert, AlertTitle } from '@mui/material';
import { useListSlice } from './slice';
import { useDispatch, useSelector } from 'react-redux';
import { selectDialogCondition, selectTask } from './slice/selectors';
import { useTranslation } from 'react-i18next';

export default function List(props) {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { actions } = useListSlice();
  const dialogState = useSelector(selectDialogCondition);
  const task = useSelector(selectTask);

  const tWrapper = (id: string, defaultMessage?: string): string => {
    return t(id) || defaultMessage;
  };

  return (
    <>
      <StylesProvider injectFirst>
        {props.item.length === 0 ? (
          <Alert severity="info">
            <AlertTitle>{t('Add.Info')}</AlertTitle>
            {t('Add.ClickTheButtonBelowToAddTasks')}
          </Alert>
        ) : (
          ''
        )}
        <Fab
          size="large"
          onClick={() => {
            dispatch(actions.openDialog());
          }}
          aria-label="add"
        >
          <Add />
        </Fab>
      </StylesProvider>
      <Dialog
        fullWidth
        maxWidth="md"
        open={dialogState}
        aria-labelledby="form-dialog-title"
        onClose={() => {
          dispatch(actions.closeDialog());
          dispatch(actions.addTask(''));
        }}
      >
        <DialogTitle id="form-dialog-title">
          {tWrapper('Add.AddTask', 'Add Task')}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {tWrapper('Add.AddYourDailyTasks')}
          </DialogContentText>
          <TextField
            onKeyPress={e => {
              if (e.key === 'Enter' && task.field.length !== 0) {
                props.onAdd(task);
                dispatch(actions.addTask(''));
                dispatch(actions.closeDialog());
              }
            }}
            autoFocus
            margin="dense"
            name="field"
            id="name"
            label={t('Add.TaskPlaceholder')}
            type="text"
            fullWidth
            onChange={e => {
              dispatch(actions.addTask(e.target.value));
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button
            id="cancel"
            onClick={() => {
              dispatch(actions.closeDialog());
              dispatch(actions.addTask(''));
            }}
            color="primary"
          >
            {t('Add.Cancel')}
          </Button>
          <Button
            onClick={() => {
              props.onAdd(task);
              dispatch(actions.addTask(''));
              dispatch(actions.closeDialog());
            }}
            color="primary"
            disabled={task.field.length !== 0 ? false : true}
          >
            {t('Add.Add')}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
