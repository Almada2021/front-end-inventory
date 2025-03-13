interface Props {
  confirmFn: () => void;
}

const ConfirmScreen = (props: Props) => {
  return (
    <div>
      <button onClick={props.confirmFn}>Clic</button>
    </div>
  );
};

export default ConfirmScreen;
